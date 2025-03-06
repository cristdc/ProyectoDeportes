import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from '../Components/Footer';

describe('Footer Component', () => {
    it('debe renderizar el texto de derechos reservados', () => {
        render(<Footer />);
        
        const currentYear = new Date().getFullYear();
        expect(screen.getByText(new RegExp(`© ${currentYear} - Derechos reservados - Alumnado IES HLanz`))).toBeInTheDocument();
    });

    it('debe tener las clases de estilo correctas', () => {
        render(<Footer />);
        
        const footer = screen.getByRole('contentinfo');
        expect(footer).toHaveClass('bg-[#9b9d79]');
        expect(footer).toHaveClass('shadow-lg');
    });
});