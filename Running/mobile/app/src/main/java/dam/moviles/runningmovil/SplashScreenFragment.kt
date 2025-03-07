package dam.moviles.runningmovil

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import dam.moviles.runningmovil.databinding.FragmentSplashScreenBinding
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

class SplashScreenFragment : Fragment() {

    private var _binding: FragmentSplashScreenBinding? = null
    private val binding: FragmentSplashScreenBinding
        get() = checkNotNull(_binding) { "uso incorrecto del objeto binding" }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        inicializarBinding(inflater, container)
        esperarInicioApp()
        return binding.root
    }

    private fun inicializarBinding(inflater: LayoutInflater, container: ViewGroup?) {
        _binding = FragmentSplashScreenBinding.inflate(inflater, container, false)
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    private fun esperarInicioApp(){
        lifecycleScope.launch {
            delay(5000)
            iniciarFadeOut()
            val mainActivity = activity as MainActivity
            mainActivity.inicializarInterfazPrincipal()
        }
    }

    fun iniciarFadeOut(){
        val mainActivity = activity as MainActivity
        mainActivity.binding.fragmentSplashScreen.animate()
            .alpha(0f)
            .setDuration(500)
        }

}
