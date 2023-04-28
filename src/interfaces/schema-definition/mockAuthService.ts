const users = {
  users: {
    __typename: 'Users',
    results: [
      {
        __typename: 'User',
        _id: '632fc3747943271e582ff7c7',
        first_name: 'Smith',
        last_name: 'Jackson',
        email: 'smith.jackson@university.com',
        password:
          '$2a$10$zZwZ9FuuHQxjWQAQQFc6cOUj59UfUMZLp7/.pGQiyS3aBsYlKgXBe',
        created_at: 1658098622,
        modified_at: 1671941336,
        last_connected_at: 1671941336,
        deleted_at: 0,
      },
      {
        __typename: 'User',
        _id: '6325166e24edff96de6bf90c',
        first_name: 'Oliver',
        last_name: 'Garcia',
        email: 'oliver.garcia@university.com',
        password:
          '$2a$10$zZwZ9FuuHQxjWQAQQFc6cOUj59UfUMZLp7/.pGQiyS3aBsYlKgXBe',
        created_at: 1658098356,
        modified_at: 1663988936,
        last_connected_at: 1663988936,
        deleted_at: 0,
      },
    ],
    pageInfo: {
      __typename: 'PageInfo',
      count: 7,
      pages: 4,
      next: 2,
      prev: null,
    },
  },
};

const allUsers = () => users;

export default allUsers;
