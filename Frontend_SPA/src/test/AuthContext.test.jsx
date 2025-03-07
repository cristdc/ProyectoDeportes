import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, act } from '@testing-library/react';
import { AuthContext, AuthProvider } from '../Context/AuthContext';
import { useContext } from 'react';

describe('AuthContext', () => {
    beforeEach(() => {
        // Limpiar localStorage antes de cada test
        localStorage.clear();
        vi.clearAllMocks();
    });

    // Test 1: Estado inicial
    // Verifica que el contexto inicie sin usuario
    it('debe proveer un valor inicial nulo cuando no hay usuario en localStorage', () => {
        const TestComponent = () => {
            const context = useContext(AuthContext);
            expect(context.user).toBeNull();
            return null;
        };

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );
    });

    // Test 2: Carga de usuario desde localStorage
    // Verifica la carga de datos desde localStorage
    it('debe cargar el usuario desde localStorage al iniciar', () => {
        const testUser = { id: 1, name: 'Test User' };
        localStorage.setItem('user', JSON.stringify(testUser));

        const TestComponent = () => {
            const context = useContext(AuthContext);
            expect(context.user).toEqual(testUser);
            return null;
        };

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );
    });

    // Test 3: Login y actualización de usuario
    // Verifica que el usuario se actualice y se guarde en localStorage
    it('debe actualizar el usuario y localStorage cuando se llama a login', () => {
        const testUser = { id: 1, name: 'Test User' };
        
        const TestComponent = () => {
            const { login, user } = useContext(AuthContext);
            
            if (!user) {
                act(() => {
                    login(testUser);
                });
            } else {
                expect(user).toEqual(testUser);
                expect(JSON.parse(localStorage.getItem('user'))).toEqual(testUser);
            }
            
            return null;
        };

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );
    });
});