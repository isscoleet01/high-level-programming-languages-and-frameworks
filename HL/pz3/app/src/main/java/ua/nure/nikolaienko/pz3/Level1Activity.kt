package ua.nure.nikolaienko.pz3

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import ua.nure.nikolaienko.pz3.databinding.ActivityLevel1Binding

class Level1Activity : AppCompatActivity() {

    private lateinit var binding: ActivityLevel1Binding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLevel1Binding.inflate(layoutInflater)
        setContentView(binding.root)

        supportActionBar?.title = "Рівень 1"

        binding.btnGreet.setOnClickListener {
            Toast.makeText(
                this,
                "Вітаємо з першим додатком на Kotlin!",
                Toast.LENGTH_LONG
            ).show()
        }
    }
}
