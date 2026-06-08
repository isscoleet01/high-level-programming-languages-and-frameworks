package ua.nure.nikolaienko.lb3

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import ua.nure.nikolaienko.lb3.adapters.ChatAdapter
import ua.nure.nikolaienko.lb3.databinding.ActivityChatBinding
import ua.nure.nikolaienko.lb3.models.Message

class ChatActivity : AppCompatActivity() {

    private lateinit var binding: ActivityChatBinding
    private var partnerId = -1

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityChatBinding.inflate(layoutInflater)
        setContentView(binding.root)
        partnerId = intent.getIntExtra("userId", -1)
        val partner = DataStore.getUserById(partnerId)
        supportActionBar?.title = partner?.name ?: "Чат"

        binding.btnSend.setOnClickListener {
            val text = binding.etMessage.text.toString().trim()
            if (text.isNotEmpty()) {
                DataStore.messages.add(Message(DataStore.currentUserId, partnerId, text))
                binding.etMessage.text?.clear()
                refresh()
            }
        }

        refresh()
    }

    private fun refresh() {
        val msgs = DataStore.getMessagesWith(partnerId)
        binding.rvMessages.layoutManager = LinearLayoutManager(this)
        binding.rvMessages.adapter = ChatAdapter(msgs)
        if (msgs.isNotEmpty()) binding.rvMessages.scrollToPosition(msgs.size - 1)
    }
}
