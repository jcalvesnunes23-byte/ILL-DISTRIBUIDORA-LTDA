
import { Product } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Serviço VIP Gold',
    category: 'Vendas',
    price: 1500.00,
    flavors: ['Original', 'Premium'],
    status: 'Ativo',
    image: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=800',
    description: 'Acesso exclusivo ILL & DISTRIBUIDORA LTDA aos serviços mais refinados da categoria.'
  },
  {
    id: '2',
    name: 'Consultoria Prime',
    category: 'Consultoria',
    price: 850.00,
    flavors: ['Estratégica', 'Operacional'],
    status: 'Ativo',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    description: 'Otimização inteligente de processos com a garantia de qualidade ILL & DISTRIBUIDORA LTDA.'
  },
  {
    id: '3',
    name: 'Suporte Advanced',
    category: 'Suporte',
    price: 450.00,
    flavors: ['24/7', 'Comercial'],
    status: 'Ativo',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=800',
    description: 'Assistência técnica especializada ILL & DISTRIBUIDORA LTDA para demandas críticas.'
  },
  {
    id: '4',
    name: 'Plano Mensal Plus',
    category: 'Assinaturas',
    price: 299.90,
    flavors: ['Padrão', 'Família'],
    status: 'Ativo',
    image: 'https://images.unsplash.com/photo-1554224155-1696413565d3?auto=format&fit=crop&q=80&w=800',
    description: 'Vantagens contínuas ILL & DISTRIBUIDORA LTDA com o melhor custo-benefício.'
  }
];
