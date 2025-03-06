package dam.moviles.runningmovil

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.webkit.WebViewClient
import dam.moviles.runningmovil.databinding.FragmentInicioBinding

class InicioFragment : Fragment() {

    private var _binding:FragmentInicioBinding? = null
    private val binding: FragmentInicioBinding
        get()= checkNotNull(_binding){"uso incorrecto del objeto binding"}


    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        inicializarBinding(inflater,container)
        inicializarWebView()
        return binding.root
    }

    private fun inicializarBinding(inflater: LayoutInflater,container: ViewGroup?) {
        _binding = FragmentInicioBinding.inflate(inflater,container,false)
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding=null
    }
    private fun inicializarWebView(){
        binding.web.webViewClient = WebViewClient()
        binding.web.loadUrl("https://www.ieshlanz.es/")
    }

}