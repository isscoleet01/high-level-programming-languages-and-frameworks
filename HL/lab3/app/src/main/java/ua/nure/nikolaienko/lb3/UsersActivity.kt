package ua.nure.nikolaienko.lb3

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import ua.nure.nikolaienko.lb3.adapters.UserAdapter
import ua.nure.nikolaienko.lb3.databinding.ActivityUsersBinding

class UsersActivity : AppCompatActivity() {

    private lateinit var binding: ActivityUsersBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityUsersBinding.inflate(layoutInflater)
        setContentView(binding.root)
        supportActionBar?.title = "Користувачі"
    }

    override fun onResume() {
        super.onResume()
        refresh()
    }

    private fun refresh() {
        val others = DataStore.users.filter { it.id != DataStore.currentUserId }
        binding.rvUsers.layoutManager = LinearLayoutManager(this)
        binding.rvUsers.adapter = UserAdapter(
            users = others,
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
                refresh()
            }
        )
    }
}
