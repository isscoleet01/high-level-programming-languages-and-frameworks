package ua.nure.nikolaienko.lb3.models

data class Post(
    val id: Int,
    val authorId: Int,
    val text: String,
    val comments: MutableList<Comment> = mutableListOf()
)
