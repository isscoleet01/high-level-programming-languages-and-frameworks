package ua.nure.nikolaienko.lb3

import android.content.Intent
import android.os.Bundle
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import ua.nure.nikolaienko.lb3.adapters.ConversationAdapter
import ua.nure.nikolaienko.lb3.databinding.ActivityMessagesBinding

class MessagesActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMessagesBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMessagesBinding.inflate(layoutInflater)
        setContentView(binding.root)
        supportActionBar?.title = "Повідомлення"
    }

    override fun onResume() {
        super.onResume()
        refresh()
    }

    private fun refresh() {
        val partners = DataStore.getConversationPartners()
        binding.tvEmpty.visibility = if (partners.isEmpty()) View.VISIBLE else View.GONE
        binding.rvConversations.layoutManager = LinearLayoutManager(this)
        binding.rvConversations.adapter = ConversationAdapter(partners) { userId ->
            val intent = Intent(this, ChatActivity::class.java)
            intent.putExtra("userId", userId)
            startActivity(intent)
        }
    }
}
