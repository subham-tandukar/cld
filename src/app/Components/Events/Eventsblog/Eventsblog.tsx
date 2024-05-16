"use client"
import React from 'react';

const Eventsblog = ({ data }) => {
  return (
    <div className="grid-parent ok-bg">
      <div className="">
        <h3 className='ok-main-title'>ताजा ब्लगहरू</h3>
      </div>
      {
        data.length > 0 ? (

          <div className='grid-item grid-item-1-4 grid-gap-20'>

            {data.map((newsItem, index) => (
              <div className="post-item" key={index}>
                <a href={newsItem.blog_url} target='_blank'>
                  <div className="post-image">
                    <img src={newsItem.blog_thumbnail} alt="" />
                  </div>
                  <span className="post-cat">{newsItem?.category}</span>
                  <h3>{newsItem.blog_title}</h3>
                  <div className="post-author">
                    {/* <img src={} alt="" /> */}

                  </div>
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="ok-no-data" style={{ textAlign: "left" }}>
            कुनै ब्लग छैन
          </div>
        )
      }
    </div>
  );
};

export default Eventsblog;