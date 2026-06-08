package ua.nure.nikolaienko.lb3.adapters

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import ua.nure.nikolaienko.lb3.DataStore
import ua.nure.nikolaienko.lb3.databinding.ItemCommentBinding
import ua.nure.nikolaienko.lb3.models.Comment

class CommentAdapter(
    private val comments: List<Comment>
) : RecyclerView.Adapter<CommentAdapter.ViewHolder>() {

    inner class ViewHolder(val binding: ItemCommentBinding) : RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val b = ItemCommentBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ViewHolder(b)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val comment = comments[position]
        val author = DataStore.getUserById(comment.authorId)
        holder.binding.tvAuthor.text = author?.name ?: "Невідомий"
        holder.binding.tvText.text = comment.text
    }

    override fun getItemCount() = comments.size
}
