package ua.nure.nikolaienko.lb3.models

data class User(
    val id: Int,
    val name: String,
    var bio: String,
    val friends: MutableList<Int> = mutableListOf()
)
