import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../hooks/useAuth';
import { AuthContext } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Mock de react-router-dom
vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn()
}));

describe('useAuth Hook', () => {
    const mockNavigate = vi.fn();
    const mockLogin = vi.fn();
    
    beforeEach(() => {
        vi.clearAllMocks();
        useNavigate.mockReturnValue(mockNavigate);
        global.fetch = vi.fn();
    });

    // Facilita el testing de los componentes con contexto
    const wrapper = ({ children }) => (
        <AuthContext.Provider value={{ login: mockLogin }}>
            {children}
        </AuthContext.Provider>
    );

    // Test 1: Registro exitoso
    // Simula el registro y verifica la navegación
    it('debe registrar un usuario exitosamente', async () => {
        const mockUserData = {
            email: 'test@test.com',
            password: '123456',
            name: 'Test User',
            age: '25',
            gender: 'male'
        };

        const mockResponse = {
            ok: true,
            json: () => Promise.resolve({ user: mockUserData })
        };

        global.fetch.mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useAuth(), { wrapper });

        await act(async () => {
            await result.current.register(mockUserData);
        });

        expect(mockLogin).toHaveBeenCalledWith(mockUserData);
        expect(mockNavigate).toHaveBeenCalledWith('/home');
    });

    // Test 2: Manejo de errores en el registro
    // Verifica que se maneje correctamente un error en el registro
    it('debe manejar errores en el registro', async () => {
        const mockUserData = {
            email: 'test@test.com',
            password: '123456'
        };

        const mockResponse = {
            ok: false,
            text: () => Promise.resolve('Error al registrar')
        };

        global.fetch.mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useAuth(), { wrapper });

        await act(async () => {
            await expect(result.current.register(mockUserData)).rejects.toThrow();
        });

        expect(mockNavigate).not.toHaveBeenCalled();
    });
}); 