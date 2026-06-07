package ua.nure.nikolaienko.pz3

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import ua.nure.nikolaienko.pz3.databinding.ActivityLevel2Binding

class Level2Activity : AppCompatActivity() {

    private lateinit var binding: ActivityLevel2Binding
    private val tasks = mutableListOf<TodoItem>()
    private lateinit var adapter: TodoAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLevel2Binding.inflate(layoutInflater)
        setContentView(binding.root)

        supportActionBar?.title = "Рівень 2 - ToDo"

        adapter = TodoAdapter(tasks)
        binding.recyclerView.layoutManager = LinearLayoutManager(this)
        binding.recyclerView.adapter = adapter

        binding.btnAdd.setOnClickListener {
            val text = binding.etTask.text.toString().trim()
            if (text.isNotEmpty()) {
                tasks.add(TodoItem(text))
                adapter.notifyItemInserted(tasks.size - 1)
                binding.etTask.text?.clear()
            }
        }
    }
}
