import { useEffect, useState } from 'react';
import api from '../../../services/api';

const CampusUpdates = ({ campus }) => {
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    api
      .get(`/campus-updates?campus=${campus}`)
      .then((res) => setUpdates(res.data.data))
      .catch(() => {});
  }, [campus]);

  if (!updates.length) return null;

  return (
    <section className="bg-blue-50 p-8 rounded">
      <h2 className="text-xl font-semibold mb-4">
        Latest Updates
      </h2>

      <div className="space-y-4">
        {updates.map((item) => (
          <div key={item._id} className="bg-white p-4 rounded shadow-sm">
            <span className="text-xs uppercase text-blue-600">
              {item.type}
            </span>
            <h3 className="font-semibold">{item.title}</h3>
            <p className="text-sm mt-1">{item.content}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CampusUpdates;
