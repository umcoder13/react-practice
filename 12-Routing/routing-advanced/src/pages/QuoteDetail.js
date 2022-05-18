import { Fragment } from "react";
import { useParams, Route, Link } from "react-router-dom";

import HighlightedQuote from '../components/quotes/HighlightedQuote';
import Comments from '../components/comments/Comments';

const DUMMY_QUOTES = [
  { id: 'q1', author: '민준', text: '안녕'},
  { id: 'q2', author: '서희', text: '반가워'},
  { id: 'q3', author: '세리', text: '와우'},
];

const QuoteDetail = () => {
  const params = useParams();

  const quote = DUMMY_QUOTES.find((quote) => quote.id === params.quoteId);

  if (!quote) {
    return <p>No quote found!</p>
  };

  return (
    <Fragment>
      <HighlightedQuote text={quote.text} author={quote.author} />
      <div className='centered'>
        <Link className='btn--flat' to={`/quotes/${params.quoteId}/comments`}>
          Load Comments
        </Link>
      </div>
      <Route path={`/quotes/${params.quoteId}/comments`}>
        <Comments />
      </Route>
    </Fragment>
  );
};

export default QuoteDetail;