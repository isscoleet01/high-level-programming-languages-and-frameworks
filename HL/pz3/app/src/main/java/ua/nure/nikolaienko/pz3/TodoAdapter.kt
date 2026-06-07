package ua.nure.nikolaienko.pz3

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import ua.nure.nikolaienko.pz3.databinding.ItemTodoBinding

class TodoAdapter(
    private val tasks: MutableList<TodoItem>
) : RecyclerView.Adapter<TodoAdapter.ViewHolder>() {

    inner class ViewHolder(val binding: ItemTodoBinding) :
        RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = ItemTodoBinding.inflate(
            LayoutInflater.from(parent.context), parent, false
        )
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val item = tasks[position]
        holder.binding.checkbox.text = item.text
        holder.binding.checkbox.isChecked = item.isDone
        holder.binding.checkbox.setOnCheckedChangeListener { _, isChecked ->
            tasks[holder.adapterPosition].isDone = isChecked
        }
    }

    override fun getItemCount() = tasks.size
}
