import React, { FC, useState, useEffect } from 'react'
import { Layout, PageBlock, PageHeader, Table } from 'vtex.styleguide'
import axios from 'axios'
import { unmarshall } from '@aws-sdk/util-dynamodb'

const AdminExample: FC = () => {
  const [total, setTotal] = useState('0');
  const [items, setItems] = useState([{}]);

  const result = items.map(item => ({ email: unmarshall(item).email, name: unmarshall(item).name, phone: formatPhone(unmarshall(item).phone) }));

  function formatPhone(phoneNumberString: string) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    var match = cleaned.match(/^(\d{2})(\d{4})(\d{4})$/);
    var match2 = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    } else if (match2) {
      return '(' + match2[1] + ') ' + match2[2] + '-' + match2[3];
    }
    return null;
  }

  useEffect(() => {
    axios.get('https://g88zmlbde4.execute-api.us-east-1.amazonaws.com/v3/items?tablename=Clients')
      .then(({ data }) => {
        setTotal(data.Count);
        setItems(data.Items);
      });
  }, []);

  return (
    <Layout pageHeader={<PageHeader title="Todos os leads" />}>
      {items &&
      <PageBlock variation="full">
      <div>
        <div>
          <div className="mb5">
            <h4 className="t-heading-4 mt0"> {total && <p>Itens: {total}</p>} </h4>

            <Table
              schema={{
                properties: {
                  name: {
                    type: 'string',
                    title: 'Nome',
                    width: 200,
                  },
                  email: {
                    type: 'string',
                    title: 'Email',
                    width: 350,
                  },
                  phone: {
                    type: 'string',
                    title: 'Telefone',
                    width: 150,
                  },
                },
              }}
              items={result}
              emptyStateLabel="Ainda sem dados"
            />
          </div>
        </div>
      </div>
      </PageBlock>
      }
    </Layout>
  )
}

export default AdminExample
