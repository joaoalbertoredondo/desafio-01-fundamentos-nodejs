import { randomUUID } from "node:crypto"
import { Database } from "./database.js"
import { buildRoutePath } from "./utils/build-route-path.js"

const database = new Database()

export const routes = [
    {
        method: "GET",
        path: buildRoutePath("/tasks"),
        handler: (req, res) => {
            const { search } = req.query

            const tasks = database.select("tasks", search ? {
                title: search,
                description: search,
            } : null)

            return res.end(JSON.stringify(tasks))
        }
    },
    {
        method: "POST",
        path: buildRoutePath("/tasks"),
        handler: (req, res) => {
            const { title, description } = req.body

            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: new Date(),
                updated_at: new Date(),
            }

            database.insert("tasks", task)

            return res.writeHead(201).end("Task created.")
        }
    },
    {
        method: "PUT",
        path: buildRoutePath("/tasks/:id"),
        handler: (req, res) => {
            const { id } = req.params
            const originalRecord = database.select("tasks").find(r => r.id === id)


            const { title, description, completed_at } = req.body

            database.update("tasks", id, {
                title: title || originalRecord.title,
                description: description || originalRecord.description,
                completed_at: completed_at || null,
                updated_at: new Date(),
                created_at: originalRecord.created_at,
            })

            return res.writeHead(204).end()
        }
    },
    {
        method: "DELETE",
        path: buildRoutePath("/tasks/:id"),
        handler: (req, res) => {
            const { id } = req.params

            database.delete("tasks", id)

            return res.writeHead(204).end()
        }
    }
]