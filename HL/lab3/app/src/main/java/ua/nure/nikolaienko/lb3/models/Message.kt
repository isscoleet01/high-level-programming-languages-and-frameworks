package ua.nure.nikolaienko.lb3.models

data class Message(
    val fromId: Int,
    val toId: Int,
    val text: String
)
