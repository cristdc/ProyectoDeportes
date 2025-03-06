package moviles.mobile

import android.os.Bundle
import android.view.View
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import moviles.mobile.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {
    lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        inicializarBinding()
        setContentView(binding.root)
    }

    fun inicializarBinding(){
        binding = ActivityMainBinding.inflate(layoutInflater)
    }

    fun inicializarInterfazPrincipal(){
        binding.fragmentContainerView.visibility = View.VISIBLE
        binding.fragmentSplashScreen.visibility = View.GONE
    }
}