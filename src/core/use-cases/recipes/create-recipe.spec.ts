import { it, describe, expect, beforeEach } from 'vitest'
import { AuthorNotFoundError } from '@/core/errors/author-not-found-error'
import { InMemoryRecipesRepository } from '../_test/in-memory-recipes-repository'
import { CreateRecipeUseCase } from './create-recipe'
import { InMemoryUsersRepository } from '../_test/in-memory-users-repository'

let recipesRepository: InMemoryRecipesRepository
let usersRepository: InMemoryUsersRepository
let sut: CreateRecipeUseCase

describe('Create Recipe Use Case', () => {
  beforeEach(() => {
    recipesRepository = new InMemoryRecipesRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new CreateRecipeUseCase(recipesRepository, usersRepository)

    usersRepository.items.push({
      id: 1,
      name: 'John Doe',
      email: 'john.doe@email.com',
      passwordHash: 'hashed-password',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  })

  it('creates a new recipe', async () => {
    const result = await sut.execute({
      title: 'Bolo de Chocolate',
      ingredients: 'Farinha, ovos, chocolate',
      method: 'Misture tudo e asse.',
      authorId: 1,
    })

    expect(result.recipe.id).toEqual(expect.any(Number))
    expect(recipesRepository.items[0].title).toEqual('Bolo de Chocolate')
  })
  it('throws an error if author does not exist', async () => {
    await expect(
      sut.execute({
        title: 'Receita Sem Autor',
        ingredients: '...',
        method: '...',
        authorId: 99,
      }),
    ).rejects.toBeInstanceOf(AuthorNotFoundError)
  })
})
