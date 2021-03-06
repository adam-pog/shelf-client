import React, { useState } from 'react';
import history from './config/history'
import { gql, useMutation } from '@apollo/client';
import Header from './Header'
import ToggleButton from 'react-toggle-button'
import './AddTransaction.scss';
import PropTypes from 'prop-types';

const ADD_TRANSACTION = gql`
  mutation createTransaction($amount: Float!, $source: String!, $day: Int!, $description: String!, $categoryId: ID!, $recurring: Boolean!) {
    createTransaction(amount: $amount, source: $source, day: $day, description: $description, categoryId: $categoryId, recurring: $recurring) {
      transaction {
        id
      }
    }
  }
`;

function AddTransaction({ match }) {
  const [amount, setAmount] = useState(0);
  const [source, setSource] = useState('');
  const [day, setDay] = useState(new Date().getDate());
  const [description, setDescription] = useState(0);
  const [recurring, setRecurring] = useState(false);
  const [addTransaction] = useMutation(
    ADD_TRANSACTION,
    { errorPolicy: 'all' }
  );

  const onKeyDown = (key) => {
    if (key === 'Enter') onSubmit()
  }

  const onSubmit = () => {
    addTransaction({
      variables: {
        amount: amount,
        source: source,
        day: day,
        description: description,
        categoryId: match.params.category_id,
        recurring: recurring
      }
    }).then(() => {
      history.push(`/budgets/${match.params.budget_id}/budget_categories/${match.params.category_id}`)
    })
  }

  return (
    <div className={'addTransactionInputContainer'} data-class='container'>
      <Header prevRoute={`/budgets/${match.params.budget_id}/budget_categories/${match.params.category_id}`} title={'Create Transaction'} />

      <span className='inputWrap recurringToggle'>
        <p className={'recurringToggleLabel'}>Recurring: </p>
        <ToggleButton
          value={ recurring }
          onToggle={(value) => setRecurring(!value)}
          trackStyle={{opacity: '70%'}}
          colors={{
            activeThumb: {
              base: '#bec8cc',
            },
            inactiveThumb: {
              base: '#666f80',
            },
            active: {
              base: '#2a614d99',
              hover: '#2a614d99',
            }
          }}
          active
        />
      </span>

      <span className='inputWrap'>
        <input
          type='text'
          className='input'
          autoFocus
          onChange={(e) => setSource(e.target.value)}
          placeholder='Source'
        >
        </input>
      </span>

      <span className='inputWrap'>
        <input
          type='number'
          className='input'
          step=".01"
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          placeholder='Amount'
        >
        </input>
      </span>

      <span className='inputWrap'>
        <input
          type='text'
          className='input'
          onChange={(e) => setDescription(e.target.value)}
          placeholder='Description'
          onKeyPress={(e) => onKeyDown(e.key)}
        >
        </input>
      </span>

      <span className='inputWrap'>
        <input
          type='number'
          className='input'
          value={day}
          onChange={(e) => setDay(e.target.value)}
          placeholder='Day'
          onKeyPress={(e) => onKeyDown(e.key)}
        >
        </input>
      </span>

      <input
        className='addTransactionSubmit'
        type='button'
        value='Submit'
        onClick={() => onSubmit()}
      >
      </input>
    </div>
  )
}

AddTransaction.propTypes = {
  match: PropTypes.object
}

export default AddTransaction;
