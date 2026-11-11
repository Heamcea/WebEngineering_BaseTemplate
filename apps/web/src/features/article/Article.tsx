import { BearList } from '../bears/BearList';
import { HighlightText } from '../search/HighlightText';

import type { BearState } from '../../types';
import type { ReactElement } from 'react';

interface ArticleProps {
  bearState: BearState;
  searchTerm: string;
}

export function Article({ bearState, searchTerm }: ArticleProps): ReactElement {
  function renderBears(): ReactElement {
    switch (bearState.status) {
      case 'loading':
        return <p>Loading bears...</p>;

      case 'error':
        return <p>{bearState.message}</p>;

      case 'empty':
        return <p>No bears found.</p>;

      case 'success':
        return <BearList bears={bearState.bears} searchTerm={searchTerm} />;
    }
  }
  return (
    <article>
      <h1>
        <HighlightText text="The trouble with Bears" query={searchTerm} />
      </h1>

      <p>
        <HighlightText text="By Evan Wild" query={searchTerm} />
      </p>

      <p>
        <HighlightText
          text="Tall, lumbering, angry, dangerous. The real live bears of this world are proud, independent creatures, self-serving and always on the hunt for food."
          query={searchTerm}
        />
      </p>

      <h2>
        <HighlightText text="Types of bear" query={searchTerm} />
      </h2>

      <table>
        <thead>
          <tr>
            <td>
              <HighlightText text="Bear Type" query={searchTerm} />
            </td>
            <td>
              <HighlightText text="Coat" query={searchTerm} />
            </td>
            <td>
              <HighlightText text="Adult size" query={searchTerm} />
            </td>
            <td>
              <HighlightText text="Habitat" query={searchTerm} />
            </td>
            <td>
              <HighlightText text="Lifespan" query={searchTerm} />
            </td>
            <td>
              <HighlightText text="Diet" query={searchTerm} />
            </td>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>
              <HighlightText text="Wild" query={searchTerm} />
            </td>
            <td>
              <HighlightText text="Brown or black" query={searchTerm} />
            </td>
            <td>
              <HighlightText text="1.4 to 2.8 meters" query={searchTerm} />
            </td>
            <td>
              <HighlightText text="Woods and forests" query={searchTerm} />
            </td>
            <td>
              <HighlightText text="25 to 28 years" query={searchTerm} />
            </td>
            <td>
              <HighlightText text="Fish, meat, plants" query={searchTerm} />
            </td>
          </tr>

          <tr>
            <td>
              <HighlightText text="Urban" query={searchTerm} />
            </td>
            <td>
              <HighlightText text="North Face" query={searchTerm} />
            </td>
            <td>
              <HighlightText text="18 to 22" query={searchTerm} />
            </td>
            <td>
              <HighlightText
                text="Condos and coffee shops"
                query={searchTerm}
              />
            </td>
            <td>
              <HighlightText text="20 to 32 years" query={searchTerm} />
            </td>
            <td>
              <HighlightText text="Starbucks, sushi" query={searchTerm} />
            </td>
          </tr>
        </tbody>
      </table>

      <h2>
        <HighlightText text="Habitats and Eating habits" query={searchTerm} />
      </h2>

      <p>
        <HighlightText
          text="Wild bears eat a variety of meat, fish, fruit, nuts, and other naturally growing ingredients..."
          query={searchTerm}
        />
      </p>

      <img src="/media/wild-bear.jpg" alt="Wild bear in forest" />

      <p>
        <HighlightText
          text="Urban (gentrified) bears on the other hand have largely abandoned the old ways..."
          query={searchTerm}
        />
      </p>

      <img src="/media/urban-bear.jpg" alt="Urban bear near buildings" />

      <h2>
        <HighlightText text="Mating rituals" query={searchTerm} />
      </h2>

      <p>
        <HighlightText
          text="Bears are romantic creatures by nature..."
          query={searchTerm}
        />
      </p>

      <audio controls>
        <source src="/media/bear.mp3" type="audio/mp3" />
        <source src="/media/bear.ogg" type="audio/ogg" />
        <p>
          <HighlightText
            text="Your browser does not support HTML5 audio."
            query={searchTerm}
          />
        </p>
      </audio>

      <aside>
        <h2>
          <HighlightText text="About the author" query={searchTerm} />
        </h2>

        <p>
          <HighlightText
            text="Evan Wild is an unemployed plumber from Doncaster..."
            query={searchTerm}
          />
        </p>
      </aside>
      {renderBears()}
    </article>
  );
}
