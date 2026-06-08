package ua.nure.nikolaienko.lb3

import android.os.Bundle
import android.widget.EditText
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import ua.nure.nikolaienko.lb3.adapters.UserAdapter
import ua.nure.nikolaienko.lb3.databinding.ActivityProfileBinding

class ProfileActivity : AppCompatActivity() {

    private lateinit var binding: ActivityProfileBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityProfileBinding.inflate(layoutInflater)
        setContentView(binding.root)
        supportActionBar?.title = "Мій профіль"

        binding.btnEditBio.setOnClickListener {
            val input = EditText(this)
            input.setText(DataStore.getCurrentUser().bio)
            AlertDialog.Builder(this)
                .setTitle("Редагувати біо")
                .setView(input)
                .setPositiveButton("Зберегти") { _, _ ->
                    DataStore.getCurrentUser().bio = input.text.toString()
                    refresh()
                }
                .setNegativeButton("Скасувати", null)
                .show()
        }
    }

    override fun onResume() {
        super.onResume()
        refresh()
    }

    private fun refresh() {
        val user = DataStore.getCurrentUser()
        binding.tvName.text = user.name
        binding.tvBio.text = user.bio
        val friends = DataStore.users.filter { user.friends.contains(it.id) }
        binding.tvFriendCount.text = "Друзів: ${friends.size}"
        binding.rvFriends.layoutManager = LinearLayoutManager(this)
        binding.rvFriends.adapter = UserAdapter(
            users = friends,
            onUserClick = {},
            onFriendClick = { friend ->
                user.friends.remove(friend.id)
                friend.friends.remove(user.id)
                refresh()
            }
        )
    }
}
