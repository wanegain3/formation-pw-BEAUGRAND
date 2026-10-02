import { test as baseTest, expect as baseExpect, Page } from "@playwright/test"
import { seConnecter } from "./helpers/auth"

type Fixtures = { authenticatedPage : Page }

// test() V2 = qui fournit aussi une authenticatedPage, cad une page déjà connectée
export const test = baseTest.extend<Fixtures>({

    authenticatedPage:async ({page},use) => {

        // préparation
        await seConnecter(page)

        // fournit la page connectée à la nouvelle version de test()
        await use(page)

    }

})

// expect() V2 : soft par défaut
export const expect = baseExpect.configure({soft:true})