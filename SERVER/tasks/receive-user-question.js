import { chatWithAgent } from "../helpers/openai.js";
/**
 * Call this like this: 
 * {
 *      "action": "openai",
 *      "query": "Hello",
 *      "history": [],
 *      "system": "You are a helpful assistant."
 * }
 */
export async function run(data, req, res) {
    try {
        const {
            query,
            history,
            system
        } = data;
        //  Validate
        if (!query || !system) {
            return res.status(200).json({
                success: false,
                message: 'Invalid data'
            })
        }
        //  Analyse
        const response = await chatWithAgent(
            query, history, system)
        //  Respond
        res.status(200).json({
            success: true,
            response
        })
    } catch (ex) {
        console.log('UNEXPECTED ERROR IN FILE: ' + import.meta.url)
        console.log(ex.message)
        res.status(200).json({
            success: false,
            message: 'Unexpected error'
        })
    }
}

