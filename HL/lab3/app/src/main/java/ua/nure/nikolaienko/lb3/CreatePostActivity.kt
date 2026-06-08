package ua.nure.nikolaienko.lb3

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import ua.nure.nikolaienko.lb3.databinding.ActivityCreatePostBinding
import ua.nure.nikolaienko.lb3.models.Post

class CreatePostActivity : AppCompatActivity() {

    private lateinit var binding: ActivityCreatePostBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityCreatePostBinding.inflate(layoutInflater)
        setContentView(binding.root)
        supportActionBar?.title = "Новий пост"

        binding.btnPublish.setOnClickListener {
            val text = binding.etPost.text.toString().trim()
            if (text.isEmpty()) {
                Toast.makeText(this, "Введіть текст поста", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }
            DataStore.posts.add(Post(DataStore.nextPostId(), DataStore.currentUserId, text))
            Toast.makeText(this, "Пост опубліковано!", Toast.LENGTH_SHORT).show()
            finish()
        }
    }
}
