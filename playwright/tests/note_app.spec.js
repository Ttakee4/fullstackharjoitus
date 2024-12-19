const { test, describe, expect, beforeEach } = require('@playwright/test')
const { loginWith, createNote } = require('./helper')

describe('Note app', () => {
  beforeEach(async ({ page, request }) => {
	await request.post('/api/testing/reset')
	await request.post('/api/users', {
	  data: {
		name: 'Kova Ukko',
		username: 'kovaukko',
	    password: 'salaisuus'
	  }
    })

	await page.goto('')
  })

  test('front page can be opened', async ({ page }) => {
    const locator = await page.getByText('Notes')
    await expect(locator).toBeVisible()
    await expect(page.getByText('Note app, Department of Computer Science, University of Helsinki 2024')).toBeVisible()
  })

  test('login fails with wrong password', async ({ page }) => {
    await page.getByRole('button', { name: 'log in' }).click()
    await page.getByTestId('username').fill('kovaukko')
    await page.getByTestId('password').fill('wrong')
    await page.getByRole('button', { name: 'login' }).click()

    const errorDiv = await page.locator('.error')
    await expect(errorDiv).toContainText('wrong credentials')
    await expect(errorDiv).toHaveCSS('border-style', 'solid')
    await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

	await expect(page.getByText('Kova Ukko logged in')).not.toBeVisible()
  })

  test('user can log in', async ({ page }) => {
    await loginWith(page, 'kovaukko', 'salaisuus')

    await expect(page.getByText('Kova Ukko logged in')).toBeVisible()
  })

  describe('and a note exists', () => {
    beforeEach(async ({ page }) => {
      await createNote(page, 'first note', true)
      await createNote(page, 'second note', true)
      await createNote(page, 'third note', true)    })

    // test('importance can be changed', async ({ page }) => {
    //   const otherNoteText = await page.getByText('second note')      
	//   const otherdNoteElement = await otherNoteText.locator('..')
    
    //   await otherdNoteElement.getByRole('button', { name: 'make not important' }).click()
    //   await expect(otherdNoteElement.getByText('make important')).toBeVisible()
    // })
  })
}) 