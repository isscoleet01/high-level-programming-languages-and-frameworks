package ua.nure.nikolaienko.lb3.adapters

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import ua.nure.nikolaienko.lb3.DataStore
import ua.nure.nikolaienko.lb3.databinding.ItemChatMessageBinding
import ua.nure.nikolaienko.lb3.models.Message

class ChatAdapter(
    private val messages: List<Message>
) : RecyclerView.Adapter<ChatAdapter.ViewHolder>() {

    inner class ViewHolder(val binding: ItemChatMessageBinding) : RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val b = ItemChatMessageBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ViewHolder(b)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val msg = messages[position]
        val isMe = msg.fromId == DataStore.currentUserId
        val author = DataStore.getUserById(msg.fromId)
        holder.binding.tvAuthor.text = if (isMe) "Ви" else (author?.name ?: "Невідомий")
        holder.binding.tvText.text = msg.text
    }

    override fun getItemCount() = messages.size
}
