const initialData = {
    products: [
        {
            id: '1',
            name: 'Special Curry Powder',
            sinhalaName: 'බැදපු තුනපහ කුඩු',
            category: 'Spices',
            price: 450,
            description: 'Our signature roasted curry powder blend, perfect for authentic Sri Lankan meat curries.',
            image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'
        },
        {
            id: '2',
            name: 'Chili Powder',
            sinhalaName: 'මිරිස් කුඩු',
            category: 'Spices',
            price: 380,
            description: 'Premium quality dried red chili powder with vibrant color and intense heat.',
            image: 'https://images.unsplash.com/photo-1626082927389-6cd097bf6ec0?auto=format&fit=crop&w=800&q=80'
        },
        {
            id: '3',
            name: 'Turmeric Powder',
            sinhalaName: 'කහ කුඩු',
            category: 'Spices',
            price: 250,
            description: 'Pure turmeric powder with high curcumin content for health and flavor.',
            image: 'https://images.unsplash.com/photo-1615485499978-6296715b5728?auto=format&fit=crop&w=800&q=80'
        },
        {
            id: '4',
            name: 'Pepper Powder',
            sinhalaName: 'ගම්මිරිස් කුඩු',
            category: 'Spices',
            price: 600,
            description: 'Freshly ground black pepper from local gardens.',
            image: 'https://images.unsplash.com/photo-1512803875323-87588b56f2f9?auto=format&fit=crop&w=800&q=80'
        },
        {
            id: '5',
            name: 'Kurakkan Flour',
            sinhalaName: 'කුරක්කන් පිටි',
            category: 'Flour',
            price: 320,
            description: 'Fine finger millet flour, ideal for pittu, roti and porridge.',
            image: 'https://images.unsplash.com/photo-1628103323049-5f284ecbb2b5?auto=format&fit=crop&w=800&q=80'
        }
    ],
    company: {
        name: 'Sriya Products',
        tagline: 'Authentic Sri Lankan Spices',
        about: 'Established in 1999, Sriya Products has been bringing the authentic taste of Sri Lankan cuisine to households across the island. We source the finest spices directly from local farmers and process them with care to preserve their natural aroma and flavor.',
        contact: {
            phone: '+94 662 287 258',
            mobile: '+94 71 143 1601',
            email: 'info@sriyaproducts.lk',
            address: 'Maussawa, Beligamuwa, Galewela, Sri Lanka'
        }
    }
};

// Initialize localStorage if empty
if (!localStorage.getItem('sriya_products_db')) {
    localStorage.setItem('sriya_products_db', JSON.stringify(initialData));
    console.log('Database initialized');
}
