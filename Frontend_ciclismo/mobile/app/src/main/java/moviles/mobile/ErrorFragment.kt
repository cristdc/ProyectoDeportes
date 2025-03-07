package moviles.mobile

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.navigation.fragment.findNavController
import moviles.mobile.databinding.FragmentErrorBinding

class ErrorFragment : Fragment() {
    private var _binding: FragmentErrorBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = FragmentErrorBinding.inflate(inflater, container, false)

        binding.retryButton.setOnClickListener {
            findNavController().navigate(R.id.inicioFragment)
        }

        return binding.root
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}