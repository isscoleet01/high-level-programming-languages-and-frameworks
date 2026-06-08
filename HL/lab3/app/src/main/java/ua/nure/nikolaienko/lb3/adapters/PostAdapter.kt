package ua.nure.nikolaienko.lb3.adapters

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import ua.nure.nikolaienko.lb3.DataStore
import ua.nure.nikolaienko.lb3.databinding.ItemPostBinding
import ua.nure.nikolaienko.lb3.models.Post

class PostAdapter(
    private val posts: List<Post>,
    private val onClick: (Post) -> Unit
) : RecyclerView.Adapter<PostAdapter.ViewHolder>() {

    inner class ViewHolder(val binding: ItemPostBinding) : RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val b = ItemPostBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ViewHolder(b)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val post = posts[position]
        val author = DataStore.getUserById(post.authorId)
        holder.binding.tvAuthor.text = author?.name ?: "Невідомий"
        holder.binding.tvText.text = post.text
        holder.binding.tvComments.text = "Коментарів: ${post.comments.size}"
        holder.binding.root.setOnClickListener { onClick(post) }
    }

    override fun getItemCount() = posts.size
}
