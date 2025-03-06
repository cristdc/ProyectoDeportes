import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Register from '../Pages/Register';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

// Mocks
vi.mock('../hooks/useAuth', () => ({
    useAuth: vi.fn()
}));

vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn()
}));

describe('Register Component', () => {
    const mockRegister = vi.fn();
    const mockNavigate = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        useAuth.mockReturnValue({ register: mockRegister });
        useNavigate.mockReturnValue(mockNavigate);
    });

    // Test 1: Renderización del formulario
    // Verifica que los campos requeridos estén presentes en el formulario
    it('debe renderizar el formulario de registro', () => {
        render(<Register />);
        
        expect(screen.getByLabelText(/nombre de usuario/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/edad/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/género/i)).toBeInTheDocument();
    });

    // Test 2: Actualización de campos
    // Verifica que los campos se actualicen correctamente al escribir
    it('debe actualizar los campos del formulario cuando el usuario escribe', () => {
        render(<Register />);
        
        const nameInput = screen.getByLabelText(/nombre de usuario/i);
        fireEvent.change(nameInput, { target: { value: 'Juan' } });
        expect(nameInput.value).toBe('Juan');

        const emailInput = screen.getByLabelText(/email/i);
        fireEvent.change(emailInput, { target: { value: 'juan@test.com' } });
        expect(emailInput.value).toBe('juan@test.com');
    });

    // Test 3: Envío del formulario
    // Verifica que el formulario se envíe correctamente con los datos correctos
    it('debe llamar a register con los datos correctos al enviar el formulario', async () => {
        render(<Register />);
        
        const formData = {
            name: 'Juan',
            email: 'juan@test.com',
            age: '25',
            password: '123456',
            gender: 'male'
        };

        // Llenar el formulario
        fireEvent.change(screen.getByLabelText(/nombre de usuario/i), 
            { target: { value: formData.name } });
        fireEvent.change(screen.getByLabelText(/email/i), 
            { target: { value: formData.email } });
        fireEvent.change(screen.getByLabelText(/edad/i), 
            { target: { value: formData.age } });
        fireEvent.change(screen.getByLabelText(/contraseña/i), 
            { target: { value: formData.password } });
        fireEvent.change(screen.getByLabelText(/género/i), 
            { target: { value: formData.gender } });

        // Simular registro exitoso
        mockRegister.mockResolvedValueOnce(true);

        // Enviar formulario
        fireEvent.submit(screen.getByRole('button', { name: /registrarse/i }));

        await waitFor(() => {
            expect(mockRegister).toHaveBeenCalledWith(formData);
            expect(mockNavigate).toHaveBeenCalledWith('/home');
        });
    });

    // Test 4: Manejo de campos incompletos
    // Verifica que el formulario no se envíe si faltan campos requeridos
    it('no debe enviar el formulario si faltan campos requeridos', async () => {
        render(<Register />);
        
        // Enviar formulario sin llenar campos
        fireEvent.submit(screen.getByRole('button', { name: /registrarse/i }));

        expect(mockRegister).not.toHaveBeenCalled();
    });
}); 