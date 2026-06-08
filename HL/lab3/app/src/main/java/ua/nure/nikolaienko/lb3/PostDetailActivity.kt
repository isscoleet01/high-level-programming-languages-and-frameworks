package ua.nure.nikolaienko.lb3

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import ua.nure.nikolaienko.lb3.adapters.CommentAdapter
import ua.nure.nikolaienko.lb3.databinding.ActivityPostDetailBinding
import ua.nure.nikolaienko.lb3.models.Comment

class PostDetailActivity : AppCompatActivity() {

    private lateinit var binding: ActivityPostDetailBinding
    private var postId = -1

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityPostDetailBinding.inflate(layoutInflater)
        setContentView(binding.root)
        postId = intent.getIntExtra("postId", -1)
        supportActionBar?.title = "Пост"

        binding.btnAddComment.setOnClickListener {
            val text = binding.etComment.text.toString().trim()
            if (text.isNotEmpty()) {
                val post = DataStore.posts.find { it.id == postId } ?: return@setOnClickListener
                post.comments.add(Comment(DataStore.currentUserId, text))
                binding.etComment.text?.clear()
                refresh()
            }
        }

        refresh()
    }

    private fun refresh() {
        val post = DataStore.posts.find { it.id == postId } ?: return
        val author = DataStore.getUserById(post.authorId)
        binding.tvAuthor.text = author?.name ?: "Невідомий"
        binding.tvText.text = post.text
        binding.rvComments.layoutManager = LinearLayoutManager(this)
        binding.rvComments.adapter = CommentAdapter(post.comments)
    }
}
