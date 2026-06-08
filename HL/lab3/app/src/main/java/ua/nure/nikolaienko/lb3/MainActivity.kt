package ua.nure.nikolaienko.lb3

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import ua.nure.nikolaienko.lb3.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        supportActionBar?.title = "Соціальна мережа"

        binding.btnSwitchUser.setOnClickListener { showUserPicker() }
        binding.btnProfile.setOnClickListener { startActivity(Intent(this, ProfileActivity::class.java)) }
        binding.btnUsers.setOnClickListener { startActivity(Intent(this, UsersActivity::class.java)) }
        binding.btnFeed.setOnClickListener { startActivity(Intent(this, FeedActivity::class.java)) }
        binding.btnMessages.setOnClickListener { startActivity(Intent(this, MessagesActivity::class.java)) }
        binding.btnSearch.setOnClickListener { startActivity(Intent(this, SearchActivity::class.java)) }
    }

    override fun onResume() {
        super.onResume()
        updateCurrentUser()
    }

    private fun updateCurrentUser() {
        val user = DataStore.getCurrentUser()
        binding.tvCurrentUser.text = "Поточний користувач: ${user.name}"
    }

    private fun showUserPicker() {
        val names = DataStore.users.map { it.name }.toTypedArray()
        AlertDialog.Builder(this)
            .setTitle("Оберіть користувача")
            .setItems(names) { _, index ->
                DataStore.currentUserId = DataStore.users[index].id
                updateCurrentUser()
            }
            .show()
    }
}
