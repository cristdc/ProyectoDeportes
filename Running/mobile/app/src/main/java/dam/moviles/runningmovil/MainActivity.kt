package dam.moviles.runningmovil

import android.os.Bundle
import android.view.View
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.navigation.NavController
import androidx.navigation.fragment.NavHostFragment
import androidx.navigation.ui.NavigationUI
import dam.moviles.runningmovil.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {

    lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        inicializarBinding()
        inicializarInterfazPrincipal()
        setContentView(binding.root)
    }

    fun inicializarInterfazPrincipal(){
        binding.fragmentSplashScreen.visibility= View.GONE
        binding.frmNavHostFragment.visibility= View.VISIBLE
    }


    fun inicializarBinding(){
        binding = ActivityMainBinding.inflate(layoutInflater)
    }
}