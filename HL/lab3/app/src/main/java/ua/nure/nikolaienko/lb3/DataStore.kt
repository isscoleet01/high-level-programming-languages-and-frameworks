package ua.nure.nikolaienko.lb3

import ua.nure.nikolaienko.lb3.models.Comment
import ua.nure.nikolaienko.lb3.models.Message
import ua.nure.nikolaienko.lb3.models.Post
import ua.nure.nikolaienko.lb3.models.User

object DataStore {
    var currentUserId = 1

    val users = mutableListOf(
        User(1, "Олексій Іваненко", "Люблю програмування та Android", mutableListOf(2)),
        User(2, "Марія Петренко", "Дизайнер UI/UX", mutableListOf(1)),
        User(3, "Іван Коваль", "Студент ХНУРЕ, ПЗПІ-24", mutableListOf())
    )

    val posts = mutableListOf(
        Post(1, 1, "Всім привіт! Це мій перший пост!", mutableListOf(Comment(2, "Вітаємо!"))),
        Post(2, 2, "Сьогодні чудова погода для роботи", mutableListOf()),
        Post(3, 3, "Вивчаю Kotlin - дуже цікаво!", mutableListOf(Comment(1, "Kotlin найкращий!")))
    )

    val messages = mutableListOf<Message>()

    fun getCurrentUser() = users.first { it.id == currentUserId }

    fun getUserById(id: Int) = users.firstOrNull { it.id == id }

    fun areFriends(a: Int, b: Int) =
        users.firstOrNull { it.id == a }?.friends?.contains(b) == true

    fun nextPostId() = (posts.maxOfOrNull { it.id } ?: 0) + 1

    fun getConversationPartners(): List<Int> {
        val partners = mutableSetOf<Int>()
        messages.forEach { msg ->
            if (msg.fromId == currentUserId) partners.add(msg.toId)
            if (msg.toId == currentUserId) partners.add(msg.fromId)
        }
        return partners.toList()
    }

    fun getMessagesWith(userId: Int): List<Message> = messages.filter {
        (it.fromId == currentUserId && it.toId == userId) ||
        (it.fromId == userId && it.toId == currentUserId)
    }
}
