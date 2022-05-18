import QuoteList from '../components/quotes/QuoteList';

const DUMMY_QUOTES = [
  { id: 'q1', author: '민준', text: '안녕'},
  { id: 'q2', author: '서희', text: '반가워'},
  { id: 'q3', author: '세리', text: '와우'},
]

const AllQuotes = () => {
  return <QuoteList quotes={DUMMY_QUOTES} />
};

export default AllQuotes;