import { AfterViewInit, Component, ElementRef, EventEmitter, Input, NgZone, OnDestroy, Output, Renderer2, ViewChild } from '@angular/core';
import { marked } from 'marked';

@Component({
    selector: 'app-typewriter-block',
    templateUrl: './typewriter-block.component.html',
    styleUrl: './typewriter-block.component.scss'
})
export class TypewriterBlockComponent implements AfterViewInit, OnDestroy {

    @ViewChild('src', { static: true }) srcRef!: ElementRef<HTMLElement>;

    @Input() cps = 36;                 // characters per second
    @Input() startDelayMs = 0;         // delay before typing
    @Input() caret = true;             // show blinking caret
    @Input() skipOnClick = true;       // click to reveal instantly
    @Input() runTypewriting = true;
    @Input() punctuationPauses: Record<string, number> = {
        '.': 250, ',': 150, ';': 180, ':': 180, '!': 260, '?': 260, '\n': 120, '—': 120, '-': 60
    };

    @Output() onFinished = new EventEmitter();

    private timeoutId: any = null;
    private destroyClicks: (() => void)[] = [];
    private caretEl: HTMLElement | null = null;
    private textNodes: Array<{ node: Text; full: string; i: number }> = [];
    private reducedMotion =
        typeof window !== 'undefined' &&
        'matchMedia' in window &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    constructor(private host: ElementRef<HTMLElement>, private r: Renderer2, private zone: NgZone) { }

    ngAfterViewInit(): void {
        // Get the author’s HTML as actual DOM
        const srcEl = this.srcRef.nativeElement;

        // If typewriting disabled or reduced motion or cps <= 0 → render immediately
        if (!this.runTypewriting || this.reducedMotion || this.cps <= 0) {
            this.finishImmediately(srcEl);
            return;
        }

        // If reduced motion or cps <= 0: leave content as-is and exit
        if (this.reducedMotion || this.cps <= 0) return;

        // Build an empty clone structure inside a DocumentFragment
        const frag = document.createDocumentFragment();
        const skeletonRoot = this.cloneStructure(srcEl, frag);

        // Map source text nodes to empty clone text nodes
        this.textNodes = [];
        this.collectTextNodes(srcEl, skeletonRoot);

        // Replace original content with skeleton
        const hostEl = this.host.nativeElement;
        hostEl.innerHTML = '';
        this.r.appendChild(hostEl, frag);

        // Caret
        if (this.caret) {
            this.caretEl = this.r.createElement('span');
            this.r.addClass(this.caretEl, 'tw-caret');
            this.r.appendChild(hostEl, this.caretEl);
        }

        // Click to skip
        if (this.skipOnClick) {
            const off = this.r.listen(hostEl, 'click', () => {
                this.finishImmediately(srcEl)
            });
            this.destroyClicks.push(off);
        }

        // Start typing after optional delay (outside Angular for perf)
        this.zone.runOutsideAngular(() => {
            if (this.startDelayMs > 0) {
                this.timeoutId = setTimeout(() => this.typeStep(), this.startDelayMs);
            } else {
                this.typeStep();
            }
        });
    }

    ngOnDestroy(): void {
        if (this.timeoutId) clearTimeout(this.timeoutId);
        this.destroyClicks.forEach(fn => fn());
        this.destroyClicks = [];
    }

    /** 
     * Clone DOM tree: same elements/attributes, but text nodes are empty 
     */
    private cloneStructure(src: Node, into: Node): Node {
        src.childNodes.forEach(child => {
            if (child.nodeType === Node.TEXT_NODE) {
                into.appendChild(document.createTextNode(''));
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                const el = child as Element;
                const cloneEl = el.cloneNode(false) as Element; // shallow clone keeps attributes
                into.appendChild(cloneEl);
                this.cloneStructure(child, cloneEl);
            }
        });
        return into;
    }

    /** 
     * Collect pairs of (empty clone text node, full source text) in DOM order 
     */
    private collectTextNodes(src: Node, clone: Node) {
        const sKids = Array.from(src.childNodes);
        const cKids = Array.from(clone.childNodes);
        for (let i = 0; i < sKids.length; i++) {
            const s = sKids[i];
            const c = cKids[i];
            if (!c) continue;

            if (s.nodeType === Node.TEXT_NODE && c.nodeType === Node.TEXT_NODE) {
                const full = (s as Text).data ?? '';
                (c as Text).data = '';
                this.textNodes.push({ node: c as Text, full, i: 0 });
            } else if (s.nodeType === Node.ELEMENT_NODE && c.nodeType === Node.ELEMENT_NODE) {
                this.collectTextNodes(s, c);
            }
        }
    }

    /** 
     * Recursive setTimeout typing (stable cadence, supports punctuation pauses) 
     */
    private typeStep() {
        const baseDelay = 1000 / this.cps;

        const pending = this.textNodes.find(t => t.i < t.full.length);
        if (!pending) { this.finish(); return; }

        const ch = pending.full[pending.i++];
        pending.node.data += ch;

        const extra = this.punctuationPauses[ch] ?? 0;
        this.timeoutId = setTimeout(() => this.typeStep(), baseDelay + extra);
    }

    private async finish() {
        if (this.caretEl) {
            setTimeout(() => this.caretEl && this.caretEl.remove(), 150);
            this.caretEl = null;
        }
        await this.doOnFinish();
    }

    private async finishImmediately(srcEl: HTMLElement) {
        if (this.timeoutId) clearTimeout(this.timeoutId);
        // Replace skeleton with original content
        this.host.nativeElement.innerHTML = srcEl.innerHTML;
        await this.doOnFinish();
    }

    async doOnFinish() {
        this.onFinished.emit();
        this.host.nativeElement.innerHTML = await marked(this.host.nativeElement.innerHTML)
    }
}

