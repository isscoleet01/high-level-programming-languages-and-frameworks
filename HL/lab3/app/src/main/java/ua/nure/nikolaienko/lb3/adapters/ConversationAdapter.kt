package ua.nure.nikolaienko.lb3.adapters

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import ua.nure.nikolaienko.lb3.DataStore
import ua.nure.nikolaienko.lb3.databinding.ItemConversationBinding

class ConversationAdapter(
    private val userIds: List<Int>,
    private val onClick: (Int) -> Unit
) : RecyclerView.Adapter<ConversationAdapter.ViewHolder>() {

    inner class ViewHolder(val binding: ItemConversationBinding) : RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val b = ItemConversationBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ViewHolder(b)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val userId = userIds[position]
        val user = DataStore.getUserById(userId)
        holder.binding.tvName.text = user?.name ?: "Невідомий"
        val lastMsg = DataStore.getMessagesWith(userId).lastOrNull()
        holder.binding.tvLastMessage.text = lastMsg?.text ?: ""
        holder.binding.root.setOnClickListener { onClick(userId) }
    }

    override fun getItemCount() = userIds.size
}
