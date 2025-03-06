import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import RootLayout from '../Layouts/RootLayout';

// Mock de los componentes
vi.mock('react-router-dom', () => ({
    Outlet: vi.fn(() => <div data-testid="mock-outlet">Outlet Content</div>)
}));

vi.mock('../Components/NavBar', () => ({
    default: () => <div data-testid="mock-navbar">NavBar</div>
}));

vi.mock('../Components/Footer', () => ({
    default: () => <div data-testid="mock-footer">Footer</div>
}));

describe('RootLayout Component', () => {
    it('debe renderizar NavBar, Outlet y Footer', () => {
        render(<RootLayout />);
        
        expect(screen.getByTestId('mock-navbar')).toBeInTheDocument();
        expect(screen.getByTestId('mock-outlet')).toBeInTheDocument();
        expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
    });

    it('debe tener la estructura correcta con las clases de estilo', () => {
        render(<RootLayout />);
        
        const mainContainer = screen.getByTestId('mock-outlet').parentElement;
        expect(mainContainer).toHaveClass('flex-grow');
        
        const rootDiv = mainContainer.parentElement;
        expect(rootDiv).toHaveClass('min-h-screen');
        expect(rootDiv).toHaveClass('flex');
        expect(rootDiv).toHaveClass('flex-col');
        expect(rootDiv).toHaveClass('bg-[#fdf7ed]');
    });
});