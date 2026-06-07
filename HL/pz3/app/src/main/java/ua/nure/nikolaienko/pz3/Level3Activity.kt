package ua.nure.nikolaienko.pz3

import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import kotlinx.coroutines.launch
import ua.nure.nikolaienko.pz3.api.RetrofitClient
import ua.nure.nikolaienko.pz3.databinding.ActivityLevel3Binding

class Level3Activity : AppCompatActivity() {

    private lateinit var binding: ActivityLevel3Binding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLevel3Binding.inflate(layoutInflater)
        setContentView(binding.root)

        supportActionBar?.title = "Рівень 3 - Retrofit"

        binding.recyclerView.layoutManager = LinearLayoutManager(this)

        loadPosts()
    }

    private fun loadPosts() {
        binding.progressBar.visibility = View.VISIBLE
        lifecycleScope.launch {
            try {
                val posts = RetrofitClient.apiService.getPosts()
                binding.recyclerView.adapter = PostAdapter(posts)
            } catch (e: Exception) {
                Toast.makeText(
                    this@Level3Activity,
                    "Помилка: ${e.message}",
                    Toast.LENGTH_LONG
                ).show()
            } finally {
                binding.progressBar.visibility = View.GONE
            }
        }
    }
}
