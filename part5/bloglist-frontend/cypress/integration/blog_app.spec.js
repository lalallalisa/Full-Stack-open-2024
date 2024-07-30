describe('Blog app', function() {
  beforeEach(function() {
    // 重置测试数据库
    cy.request('POST', 'http://localhost:3003/api/testing/reset')

    // 创建一个新用户
    const user = {
      name: 'Test User',
      username: 'testuser',
      password: 'password'
    }
    cy.request('POST', 'http://localhost:3003/api/users', user)

    // 访问应用程序
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Login').should('be.visible')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('input[name="username"]').type('testuser')
      cy.get('input[name="password"]').type('password')
      cy.get('button[type="submit"]').click()

      cy.contains('Test User logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('input[name="username"]').type('testuser')
      cy.get('input[name="password"]').type('wrongpassword')
      cy.get('button[type="submit"]').click()

      cy.contains('Wrong username or password')
      cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      
      cy.get('input[name="username"]').type('testuser')
      cy.get('input[name="password"]').type('password')
      cy.get('button[type="submit"]').click()
      cy.contains('create new blog').click()
      cy.get('input[placeholder="title"]').type('New Blog Title')
      cy.get('input[placeholder="author"]').type('New Blog Author')
      cy.get('input[placeholder="url"]').type('http://example.com/newblog')
      cy.get('button[type="submit"]').click()
      cy.contains('New Blog Title by New Blog Author')
    })

    it('A blog can be created', function() {
      cy.contains('New Blog Title by New Blog Author')
    })

    it('A blog can be liked', function() {
      cy.contains('view').click()
      cy.contains('like').click()
      cy.contains('1 likes')
    })

    it('A blog can be deleted by its creator', function() {
      cy.contains('view').click()
      cy.contains('remove').click()
      cy.on('window:confirm', () => true) 
      cy.contains('New Blog Title by New Blog Author').should('not.exist')
    })

    it('Blogs are sorted by likes', function() {
      // Create multiple blogs to test sorting
      cy.contains('create new blog').click()
      cy.get('input[placeholder="title"]').type('Another Blog Title')
      cy.get('input[placeholder="author"]').type('Another Blog Author')
      cy.get('input[placeholder="url"]').type('http://example.com/anotherblog')
      cy.get('button[type="submit"]').click()
      cy.contains('Another Blog Title by Another Blog Author')

      // Like the second blog
      cy.get('.blog').eq(1).contains('view').click()
      cy.get('.blog').eq(1).contains('like').click()
      cy.get('.blog').eq(1).contains('like').click()
      cy.get('.blog').eq(1).contains('2 likes')

      // Check sort
      cy.get('.blog').eq(0).should('contain', 'Another Blog Title')
      cy.get('.blog').eq(1).should('contain', 'New Blog Title')
    })
  })
})
