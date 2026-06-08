package ua.nure.nikolaienko.lb3.adapters

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import ua.nure.nikolaienko.lb3.DataStore
import ua.nure.nikolaienko.lb3.databinding.ItemUserBinding
import ua.nure.nikolaienko.lb3.models.User

class UserAdapter(
    private val users: List<User>,
    private val onUserClick: (User) -> Unit,
    private val onFriendClick: (User) -> Unit
) : RecyclerView.Adapter<UserAdapter.ViewHolder>() {

    inner class ViewHolder(val binding: ItemUserBinding) : RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val b = ItemUserBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ViewHolder(b)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val user = users[position]
        holder.binding.tvName.text = user.name
        holder.binding.tvBio.text = user.bio
        val isFriend = DataStore.areFriends(DataStore.currentUserId, user.id)
        holder.binding.btnFriend.text = if (isFriend) "Видалити з друзів" else "Додати в друзі"
        holder.binding.root.setOnClickListener { onUserClick(user) }
        holder.binding.btnFriend.setOnClickListener { onFriendClick(user) }
    }

    override fun getItemCount() = users.size
}
