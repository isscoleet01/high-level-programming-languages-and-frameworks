package ua.nure.nikolaienko.lb3

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import ua.nure.nikolaienko.lb3.databinding.ActivityUserDetailBinding

class UserDetailActivity : AppCompatActivity() {

    private lateinit var binding: ActivityUserDetailBinding
    private var userId = -1

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityUserDetailBinding.inflate(layoutInflater)
        setContentView(binding.root)
        userId = intent.getIntExtra("userId", -1)

        binding.btnFriend.setOnClickListener {
            val me = DataStore.getCurrentUser()
            val user = DataStore.getUserById(userId) ?: return@setOnClickListener
            if (me.friends.contains(userId)) {
                me.friends.remove(userId)
                user.friends.remove(me.id)
            } else {
                me.friends.add(userId)
                user.friends.add(me.id)
            }
            refresh()
        }

        binding.btnMessage.setOnClickListener {
            val intent = Intent(this, ChatActivity::class.java)
            intent.putExtra("userId", userId)
            startActivity(intent)
        }
    }

    override fun onResume() {
        super.onResume()
        refresh()
    }

    private fun refresh() {
        val user = DataStore.getUserById(userId) ?: return
        supportActionBar?.title = user.name
        binding.tvName.text = user.name
        binding.tvBio.text = user.bio
        binding.tvFriendCount.text = "Друзів: ${user.friends.size}"
        val isFriend = DataStore.areFriends(DataStore.currentUserId, userId)
        binding.btnFriend.text = if (isFriend) "Видалити з друзів" else "Додати в друзі"
    }
}
