package ua.nure.nikolaienko.lb3

import android.content.Intent
import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import ua.nure.nikolaienko.lb3.adapters.PostAdapter
import ua.nure.nikolaienko.lb3.adapters.UserAdapter
import ua.nure.nikolaienko.lb3.databinding.ActivitySearchBinding

class SearchActivity : AppCompatActivity() {

    private lateinit var binding: ActivitySearchBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivitySearchBinding.inflate(layoutInflater)
        setContentView(binding.root)
        supportActionBar?.title = "Пошук"

        binding.etSearch.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                search(s.toString())
            }
            override fun afterTextChanged(s: Editable?) {}
        })

        setResultsVisible(false)
    }

    private fun setResultsVisible(visible: Boolean) {
        val v = if (visible) View.VISIBLE else View.GONE
        binding.tvUsersLabel.visibility = v
        binding.rvUsers.visibility = v
        binding.tvPostsLabel.visibility = v
        binding.rvPosts.visibility = v
    }

    private fun search(query: String) {
        if (query.isBlank()) {
            setResultsVisible(false)
            return
        }
        setResultsVisible(true)
        val q = query.lowercase()

        val foundUsers = DataStore.users.filter {
            it.name.lowercase().contains(q) || it.bio.lowercase().contains(q)
        }
        binding.rvUsers.layoutManager = LinearLayoutManager(this)
        binding.rvUsers.adapter = UserAdapter(
            users = foundUsers,
            onUserClick = { user ->
                val intent = Intent(this, UserDetailActivity::class.java)
                intent.putExtra("userId", user.id)
                startActivity(intent)
            },
            onFriendClick = { user ->
                val me = DataStore.getCurrentUser()
                if (me.friends.contains(user.id)) {
                    me.friends.remove(user.id)
                    user.friends.remove(me.id)
                } else {
                    me.friends.add(user.id)
                    user.friends.add(me.id)
                }
                search(query)
            }
        )

        val foundPosts = DataStore.posts.filter { it.text.lowercase().contains(q) }
        binding.rvPosts.layoutManager = LinearLayoutManager(this)
        binding.rvPosts.adapter = PostAdapter(foundPosts) { post ->
            val intent = Intent(this, PostDetailActivity::class.java)
            intent.putExtra("postId", post.id)
            startActivity(intent)
        }
    }
}
