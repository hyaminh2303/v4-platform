import { expect } from 'chai'
import React from 'react'
import TestUtils from 'react-addons-test-utils'
import { CampaignList } from '../index'

describe('Campaign list component', () => {
  it('renders ', () => {
    const component = TestUtils.renderIntoDocument(<CampaignList />)
    expect(component).toExists()
  })
})

