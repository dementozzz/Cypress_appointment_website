describe('Appointment', () => {
  beforeEach('Visit and logged in to the website', () => {
    cy.visit('https://katalon-demo-cura.herokuapp.com/')

    cy.get("#btn-make-appointment").click()

    cy.fixture('credential').then(($data) => {
      cy.login($data.username, $data.password)
    })
  })

  it('Successfully make an appointment', () => {

    cy.fixture('data').then(($formData) => {
      const objDate = {"date" : $formData.date, "month" : $formData.month, "year" : $formData.year}
      
      cy.get("select#combo_facility").select($formData.facility[2])
      cy.get("[type='checkbox']#chk_hospotal_readmission").check()
      cy.get("[type='radio']").check($formData.program[1])
      cy.pickDate(objDate)
      cy.get("textarea#txt_comment").type($formData.comment, {force : true})
      cy.get("#btn-book-appointment").click()


      /*==============================
      (assertion) make sure the submitted data from previous page is match in the summary page
      ==============================*/
      cy.get("#facility").invoke('text').then(($facility) => {
        expect($facility)
          .to.equal($formData.facility[2]) 
      })
      cy.get("#hospital_readmission").invoke('text').then(($isReadmission) => {
        expect($isReadmission)
          .to.equal('Yes')
      })
      cy.get("#program").invoke('text').then(($program) => {
        expect($program)
          .to.equal($formData.program[1])
      })
      cy.get("#visit_date").invoke('text').then(($date) => {
        let month = $formData.month < 10 ? ("0" + $formData.month) : $formData.month
        let finalDate = $formData.date + "/" + month + "/" + $formData.year

        expect($date).to.equal(finalDate)
      })
      cy.get("#comment").invoke('text').then(($comment) => {
        expect($comment)
          .to.equal($formData.comment)
      })
    })
  })

  it('Make an appoinment without set visit date should not redirect to summary page', () => {
    cy.fixture('data').then(($formData) => {
      const objDate = {"date" : $formData.date, "month" : $formData.month, "year" : $formData.year}
      
      cy.get("select#combo_facility").select($formData.facility[0])
      cy.get("[type='checkbox']#chk_hospotal_readmission").check()
      cy.get("[type='radio']").check($formData.program[2]) 
      cy.get("textarea#txt_comment").type($formData.comment, {force : true})
      cy.get("#btn-book-appointment").click()


      /*==============================
      (assertion) make sure the user is not porceed to the next page as 'visit date' is required
      ==============================*/
      cy.url().then(($url) => {
        expect($url).to.not.equal("https://katalon-demo-cura.herokuapp.com/appointment.php#summary")
      })
    })
  })

  it('Make appointment for yesterday should not allowed', () => {
    let currentDate = new Date()
    currentDate.setDate(currentDate.getDate() - 1)
    
    cy.fixture('data').then(($formData) => {
      const objDate = {"date" : currentDate.getDate(), "month" : (currentDate.getMonth() + 1), "year" : currentDate.getFullYear()}
      
      cy.get("select#combo_facility").select($formData.facility[2])
      cy.get("[type='checkbox']#chk_hospotal_readmission").check()
      cy.get("[type='radio']").check($formData.program[1])
      cy.pickDate(objDate)
      cy.get("textarea#txt_comment").type($formData.comment, {force : true})
      cy.get("#btn-book-appointment").click()


      /*==============================
      (assertion) make sure the user is not proceed to the next page as 'visit date' is lower than the current date
      ==============================*/
      cy.url().then(($url) => {
        expect($url).to.not.equal("https://katalon-demo-cura.herokuapp.com/appointment.php#summary")
      })
    })
  })
})