export const MOCK_USERS = [
    {
        id: 1,
        username: 'usuario_teste',
        name: 'Você (Admin)',
        avatar: 'https://picsum.photos/150/150?random=10',
        bio: 'Desenvolvedor do InstaClone 🚀',
        followersCount: 150,
        followingCount: 200,
        password: 'senha123' // Apenas para o login local-first
    },
    {
        id: 2,
        username: 'travel_lover',
        name: 'Ana Silva',
        avatar: 'https://picsum.photos/150/150?random=11',
        bio: 'Explorando o mundo 🌍',
        followersCount: 1200,
        followingCount: 400
    },
    {
        id: 3,
        username: 'tech_guru',
        name: 'Marcos Tech',
        avatar: 'https://picsum.photos/150/150?random=12',
        bio: 'Viciado em código e café ☕',
        followersCount: 850,
        followingCount: 150
    }
];

export const MOCK_POSTS = [
    {
        id: 101,
        authorId: 2,
        username: 'travel_lover',
        userAvatar: 'https://picsum.photos/150/150?random=11',
        imageUrl: 'https://picsum.photos/600/600?random=1',
        caption: 'Que vista incrível! #viagem #natureza',
        location: 'Rio de Janeiro, Brasil',
        likesCount: 124,
        likedBy: [], // IDs dos usuários que curtiram
        createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hora atrás
        comments: [
            { id: 1, userId: 3, username: 'tech_guru', text: 'Top demais!', createdAt: new Date().toISOString() }
        ]
    },
    {
        id: 102,
        authorId: 3,
        username: 'tech_guru',
        userAvatar: 'https://picsum.photos/150/150?random=12',
        imageUrl: 'https://picsum.photos/600/600?random=2',
        caption: 'Novo setup pronto para o projeto final.',
        location: 'São Paulo, Brasil',
        likesCount: 89,
        likedBy: [],
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 dia atrás
        comments: []
    }
];