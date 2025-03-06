import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import NavBar from '../Components/NavBar';
import { useNavigate } from 'react-router-dom';

// Mock de react-router-dom
vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn()
}));

describe('NavBar Component', () => {
    const mockNavigate = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        useNavigate.mockReturnValue(mockNavigate);
    });

    it('debe renderizar el logo y título', () => {
        render(<NavBar />);
        
        expect(screen.getByAltText('Logo')).toBeInTheDocument();
        expect(screen.getByText('MULTISPORTS')).toBeInTheDocument();
    });

    it('debe mostrar el botón de registro cuando no está registrado', () => {
        render(<NavBar />);
        
        const registerButton = screen.getByRole('button', { name: /registrarse/i });
        expect(registerButton).toBeInTheDocument();
    });

    it('debe navegar a /register al hacer clic en el botón de registro', () => {
        render(<NavBar />);
        
        const registerButton = screen.getByRole('button', { name: /registrarse/i });
        fireEvent.click(registerButton);
        
        expect(mockNavigate).toHaveBeenCalledWith('/register');
    });
});