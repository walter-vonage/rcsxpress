export const FLOW: any = {
    "flowId": "spring_sale_event",
    "name": "Spring Sale Event",
    "start": "step1",
    "steps": {
        "step1": {
            "type": "message",
            "text": "👋 Hello there! Welcome to our Spring Sale Event!",
            "next": "step2"
        },
        "step2": {
            "type": "wait",
            "duration": 1000,
            "next": "step3"
        },
        "step3": {
            "type": "message",
            "text": "🌟 Exciting offers just for you! Choose a category below:",
            "next": "step4"
        },
        "step4": {
            "type": "card",
            "title": "Select a Category",
            "buttons": [
                {
                    "label": "👗 Fashion",
                    "next": "fashion"
                },
                {
                    "label": "📱 Electronics",
                    "next": "electronics"
                },
                {
                    "label": "🍽️ Home & Kitchen",
                    "next": "home_kitchen"
                }
            ]
        },
        "fashion": {
            "type": "message",
            "text": "👗 Awesome! Here are our fashion deals:",
            "next": "fashion_offers"
        },
        "electronics": {
            "type": "message",
            "text": "📱 Fantastic choice! Check out our electronics:",
            "next": "electronics_offers"
        },
        "home_kitchen": {
            "type": "message",
            "text": "🍽️ Great pick! Here are home & kitchen essentials:",
            "next": "home_kitchen_offers"
        },
        "fashion_offers": {
            "type": "card",
            "title": "Top Fashion Picks",
            "buttons": [
                {
                    "label": "Stylish Dress - £49",
                    "next": "details_fashion_1"
                },
                {
                    "label": "Casual Sneakers - £39",
                    "next": "details_fashion_2"
                },
                {
                    "label": "Leather Jacket - £99",
                    "next": "details_fashion_3"
                }
            ]
        },
        "electronics_offers": {
            "type": "card",
            "title": "Best Electronics Deals",
            "buttons": [
                {
                    "label": "Smartphone - £299",
                    "next": "details_electronics_1"
                },
                {
                    "label": "Wireless Earbuds - £79",
                    "next": "details_electronics_2"
                },
                {
                    "label": "Bluetooth Speaker - £59",
                    "next": "details_electronics_3"
                }
            ]
        },
        "home_kitchen_offers": {
            "type": "card",
            "title": "Home & Kitchen Essentials",
            "buttons": [
                {
                    "label": "Non-Stick Cookware Set - £89",
                    "next": "details_home_1"
                },
                {
                    "label": "Coffee Maker - £79",
                    "next": "details_home_2"
                },
                {
                    "label": "Vacuum Cleaner - £199",
                    "next": "details_home_3"
                }
            ]
        },
        "details_fashion_1": {
            "type": "card",
            "title": "🌸 Stylish Dress",
            "description": "Perfect for any occasion, available in multiple sizes.",
            "buttons": [
                {
                    "label": "✅ Reserve Now",
                    "next": "reserved_fashion_1",
                    "stateActions": [
                        {
                            "action": "addToBasket",
                            "item": "Stylish Dress - £49"
                        }
                    ]
                },
                {
                    "label": "⬅️ Back to Fashion",
                    "next": "fashion_offers"
                }
            ]
        },
        "details_fashion_2": {
            "type": "card",
            "title": "👟 Casual Sneakers",
            "description": "Comfortable sneakers for everyday wear.",
            "buttons": [
                {
                    "label": "✅ Reserve Now",
                    "next": "reserved_fashion_2",
                    "stateActions": [
                        {
                            "action": "addToBasket",
                            "item": "Casual Sneakers - £39"
                        }
                    ]
                },
                {
                    "label": "⬅️ Back to Fashion",
                    "next": "fashion_offers"
                }
            ]
        },
        "details_fashion_3": {
            "type": "card",
            "title": "🧥 Leather Jacket",
            "description": "Stylish and durable, a must-have for your wardrobe.",
            "buttons": [
                {
                    "label": "✅ Reserve Now",
                    "next": "reserved_fashion_3",
                    "stateActions": [
                        {
                            "action": "addToBasket",
                            "item": "Leather Jacket - £99"
                        }
                    ]
                },
                {
                    "label": "⬅️ Back to Fashion",
                    "next": "fashion_offers"
                }
            ]
        },
        "details_electronics_1": {
            "type": "card",
            "title": "📱 Smartphone",
            "description": "High performance and sleek design.",
            "buttons": [
                {
                    "label": "✅ Reserve Now",
                    "next": "reserved_electronics_1",
                    "stateActions": [
                        {
                            "action": "addToBasket",
                            "item": "Smartphone - £299"
                        }
                    ]
                },
                {
                    "label": "⬅️ Back to Electronics",
                    "next": "electronics_offers"
                }
            ]
        },
        "details_electronics_2": {
            "type": "card",
            "title": "🎧 Wireless Earbuds",
            "description": "Experience premium sound quality on the go.",
            "buttons": [
                {
                    "label": "✅ Reserve Now",
                    "next": "reserved_electronics_2",
                    "stateActions": [
                        {
                            "action": "addToBasket",
                            "item": "Wireless Earbuds - £79"
                        }
                    ]
                },
                {
                    "label": "⬅️ Back to Electronics",
                    "next": "electronics_offers"
                }
            ]
        },
        "details_electronics_3": {
            "type": "card",
            "title": "🔊 Bluetooth Speaker",
            "description": "Portable speaker with powerful sound.",
            "buttons": [
                {
                    "label": "✅ Reserve Now",
                    "next": "reserved_electronics_3",
                    "stateActions": [
                        {
                            "action": "addToBasket",
                            "item": "Bluetooth Speaker - £59"
                        }
                    ]
                },
                {
                    "label": "⬅️ Back to Electronics",
                    "next": "electronics_offers"
                }
            ]
        },
        "details_home_1": {
            "type": "card",
            "title": "🍳 Non-Stick Cookware Set",
            "description": "Everything you need for perfect cooking.",
            "buttons": [
                {
                    "label": "✅ Reserve Now",
                    "next": "reserved_home_1",
                    "stateActions": [
                        {
                            "action": "addToBasket",
                            "item": "Non-Stick Cookware Set - £89"
                        }
                    ]
                },
                {
                    "label": "⬅️ Back to Home",
                    "next": "home_kitchen_offers"
                }
            ]
        },
        "details_home_2": {
            "type": "card",
            "title": "☕ Coffee Maker",
            "description": "Brew delicious coffee with ease.",
            "buttons": [
                {
                    "label": "✅ Reserve Now",
                    "next": "reserved_home_2",
                    "stateActions": [
                        {
                            "action": "addToBasket",
                            "item": "Coffee Maker - £79"
                        }
                    ]
                },
                {
                    "label": "⬅️ Back to Home",
                    "next": "home_kitchen_offers"
                }
            ]
        },
        "details_home_3": {
            "type": "card",
            "title": "🧹 Vacuum Cleaner",
            "description": "Efficient cleaning for a spotless home.",
            "buttons": [
                {
                    "label": "✅ Reserve Now",
                    "next": "reserved_home_3",
                    "stateActions": [
                        {
                            "action": "addToBasket",
                            "item": "Vacuum Cleaner - £199"
                        }
                    ]
                },
                {
                    "label": "⬅️ Back to Home",
                    "next": "home_kitchen_offers"
                }
            ]
        },
        "reserved_fashion_1": {
            "type": "message",
            "text": "🎉 Reservation confirmed for Stylish Dress!",
            "next": "checkout"
        },
        "reserved_fashion_2": {
            "type": "message",
            "text": "🎉 Reservation confirmed for Casual Sneakers!",
            "next": "checkout"
        },
        "reserved_fashion_3": {
            "type": "message",
            "text": "🎉 Reservation confirmed for Leather Jacket!",
            "next": "checkout"
        },
        "reserved_electronics_1": {
            "type": "message",
            "text": "🎉 Reservation confirmed for Smartphone!",
            "next": "checkout"
        },
        "reserved_electronics_2": {
            "type": "message",
            "text": "🎉 Reservation confirmed for Wireless Earbuds!",
            "next": "checkout"
        },
        "reserved_electronics_3": {
            "type": "message",
            "text": "🎉 Reservation confirmed for Bluetooth Speaker!",
            "next": "checkout"
        },
        "reserved_home_1": {
            "type": "message",
            "text": "🎉 Reservation confirmed for Non-Stick Cookware Set!",
            "next": "checkout"
        },
        "reserved_home_2": {
            "type": "message",
            "text": "🎉 Reservation confirmed for Coffee Maker!",
            "next": "checkout"
        },
        "reserved_home_3": {
            "type": "message",
            "text": "🎉 Reservation confirmed for Vacuum Cleaner!",
            "next": "checkout"
        },
        "checkout": {
            "type": "checkout",
            "title": "🛒 Checkout",
            "description": "Please review your reservation and complete payment.",
            "buttons": [
                {
                    "label": "💳 Proceed to Payment",
                    "next": "final"
                },
                {
                    "label": "⬅️ Back to Menu",
                    "next": "step4"
                }
            ]
        },
        "final": {
            "type": "message",
            "text": "🙏 Thank you for shopping with us! Enjoy your day!",
            "end": true
        }
    }
}