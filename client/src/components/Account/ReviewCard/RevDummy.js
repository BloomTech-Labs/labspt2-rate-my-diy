// basic rated

<div>
  <MicroModal
    trigger={(handleOpen) => (
      <div>
        <div>{`${review.ProjectReviewed.name}`}</div>
        <div>{`Review By: @${review.Author.username}`}</div>
        <div>{`${review.timestamp}`}</div>
        <img src={`${review.ProjectReviewed.titleImg}`} alt="project" />
        <div>{`${review.name}`}</div>
        <button onClick={handleOpen}>View More</button>
      </div>
    )}
    children={(handleClose) => (
      <div>
        <div>{`${review.ProjectReviewed.name}`}</div>
        <div>{`Review By: @${review.Author.username}`}</div>
        <div>{`${review.timestamp}`}</div>
        <img src={`${review.ProjectReviewed.titleImg}`} alt="project" />
        <div>{`Rating of Project: ${review.projRating}`}</div>
        <div>{`${review.name}`}</div>
        <div>{`${review.text}`}</div>
        <Mutation mutation={likeAProject}>
          {(likeAProject, { loading, error, data }) => {
            return (
              <form
                onSubmit={async (e) => {
                  e.preventDefualt();
                  await likeAReview({
                    variables: {
                      id: review.id,
                      username: this.state.visitor.username
                    }
                  });
                  await this.thumbsUp();
                }}
              >
                <span>
                  <button type="submit" disabled={this.state.thumbsUpDisabled}>
                    +
                  </button>
                  {`Thumbs Up: ${review.thumbsUp}`}
                </span>
                |
              </form>
            );
          }}
        </Mutation>

        <Mutation mutation={dislikeAProject}>
          {(dislikeAProject, { loading, error, data }) => {
            return (
              <form
                onSubmit={async (e) => {
                  e.preventDefualt();
                  await likeAReview({
                    variables: {
                      id: review.id,
                      username: this.state.visitor.username
                    }
                  });
                  await this.thumbsDown();
                }}
              >
                <span>
                  <button
                    type="submit"
                    disabled={this.state.thumbsDownDisabled}
                  >
                    -
                  </button>
                  {`Thumbs Down: ${review.thumbsDown}`}
                </span>
                |
              </form>
            );
          }}
        </Mutation>
        <button onClick={handleClose}>Close</button>
      </div>
    )}
  />
</div>;

// basic unrated
<div>
  <MicroModal
    trigger={(handleOpen) => (
      <div>
        <div>{`${review.ProjectReviewed.name}`}</div>
        <div>{`Review By: @${review.Author.username}`}</div>
        <div>{`${review.timestamp}`}</div>
        <img src={`${review.ProjectReviewed.titleImg}`} alt="project" />
        <div>{`${review.name}`}</div>
        <button onClick={handleOpen}>View More</button>
      </div>
    )}
    children={(handleClose) => (
      <div>
        <div>{`${review.ProjectReviewed.name}`}</div>
        <div>{`Review By: @${review.Author.username}`}</div>
        <div>{`${review.timestamp}`}</div>
        <img src={`${review.ProjectReviewed.titleImg}`} alt="project" />
        <div>{`${review.name}`}</div>
        <div>{`${review.text}`}</div>
        <span>
          <button>+</button>
          {`Thumbs Up: ${review.thumbsUp}`}
        </span>
        |
        <span>
          <button>-</button>
          {`Thumbs Down: ${review.thumbsDown}`}
        </span>
        <Mutation mutation={likeAProject}>
          {(likeAProject, { loading, error, data }) => {
            return (
              <form
                onSubmit={async (e) => {
                  e.preventDefualt();
                  await likeAReview({
                    variables: {
                      id: review.id,
                      username: this.state.visitor.username
                    }
                  });
                  await this.thumbsUp();
                }}
              >
                <span>
                  <button type="submit" disabled={this.state.thumbsUpDisabled}>
                    +
                  </button>
                  {`Thumbs Up: ${review.thumbsUp}`}
                </span>
                |
              </form>
            );
          }}
        </Mutation>
        <Mutation mutation={dislikeAProject}>
          {(dislikeAProject, { loading, error, data }) => {
            return (
              <form
                onSubmit={async (e) => {
                  e.preventDefualt();
                  await likeAReview({
                    variables: {
                      id: review.id,
                      username: this.state.visitor.username
                    }
                  });
                  await this.thumbsDown();
                }}
              >
                <span>
                  <button
                    type="submit"
                    disabled={this.state.thumbsDownDisabled}
                  >
                    -
                  </button>
                  {`Thumbs Down: ${review.thumbsDown}`}
                </span>
                |
              </form>
            );
          }}
        </Mutation>
        <button onClick={handleClose}>Close</button>
      </div>
    )}
  />
</div>;

// your own before edit, no rating

<div>
  <MicroModal
    trigger={(handleOpen) => (
      <div>
        <div>{`${review.ProjectReviewed.name}`}</div>
        <div>{`Review By: @${review.Author.username}`}</div>
        <div>{`${review.timestamp}`}</div>
        <img src={`${review.ProjectReviewed.titleImg}`} alt="project" />
        <div>{`${review.name}`}</div>
        <button onClick={handleOpen}>View More</button>
      </div>
    )}
    children={(handleClose) => (
      <div>
        <div>{`${review.ProjectReviewed.name}`}</div>
        <div>{`Review By: @${review.Author.username}`}</div>
        <div>{`${review.timestamp}`}</div>
        <img src={`${review.ProjectReviewed.titleImg}`} alt="project" />
        <div>{`${review.name}`}</div>
        <div>{`${review.text}`}</div>
        <span>{`Thumbs Up: ${review.thumbsUp}`}</span>|
        <span>{`Thumbs Down: ${review.thumbsDown}`}</span>
        <div>
          <button onClick={() => this.setState({ ...this.state, edit: true })}>
            Edit
          </button>
          <button onClick={handleClose}>Close</button>
        </div>
      </div>
    )}
  />
</div>;

// your own before edit, rating

<div>
  <MicroModal
    trigger={(handleOpen) => (
      <div>
        <div>{`${review.ProjectReviewed.name}`}</div>
        <div>{`Review By: @${review.Author.username}`}</div>
        <div>{`${review.timestamp}`}</div>
        <img src={`${review.ProjectReviewed.titleImg}`} alt="project" />
        <div>{`${review.name}`}</div>
        <button onClick={handleOpen}>View More</button>
      </div>
    )}
    children={(handleClose) => (
      <div>
        <div>{`${review.ProjectReviewed.name}`}</div>
        <div>{`Review By: @${review.Author.username}`}</div>
        <div>{`${review.timestamp}`}</div>
        <img src={`${review.ProjectReviewed.titleImg}`} alt="project" />
        <div>{`Rating of Project: ${review.projRating}`}</div>
        <div>{`${review.name}`}</div>
        <div>{`${review.text}`}</div>
        <span>{`Thumbs Up: ${review.thumbsUp}`}</span>|
        <span>{`Thumbs Down: ${review.thumbsDown}`}</span>
        <div>
          <button onClick={() => this.setState({ ...this.state, edit: true })}>
            Edit
          </button>
          <button onClick={handleClose}>Close</button>
        </div>
      </div>
    )}
  />
</div>;

// your own during edit, no rating

<div>
  <MicroModal
    trigger={(handleOpen) => (
      <div>
        <div>{`${review.ProjectReviewed.name}`}</div>
        <div>{`Review By: @${review.Author.username}`}</div>
        <div>{`${review.timestamp}`}</div>
        <img src={`${review.ProjectReviewed.titleImg}`} alt="project" />
        <div>{`${review.name}`}</div>
        <button onClick={handleOpen}>View More</button>
      </div>
    )}
    children={(handleClose) => (
      <Mutation mutation={editReview}>
        {(editReview, { loading, error, data }) => {
          return (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const date = await new Date(Date.now());
                await editReview({
                  variables: {
                    name: this.state.name,
                    text: this.state.text,
                    timestamp: date,
                    projId: review.ProjectReviewed.id,
                    revId: review.id,
                    projRating: this.state.projRating
                  }
                });
                await this.setState({ ...this.state, edit: false });
              }}
            >
              <div>
                <div>{`${review.ProjectReviewed.name}`}</div>
                <div>{`Review By: @${review.Author.username}`}</div>
                <div>{`${review.timestamp}`}</div>
                <img src={`${review.ProjectReviewed.titleImg}`} alt="project" />
                <div>Rating of Project:</div>
                <select
                  name="stars"
                  onChange={this.starChange}
                  value={this.state.stars}
                  disabled
                >
                  <option value="0">Rating</option>
                  <option value="1">1 star</option>
                  <option value="2">2 stars</option>
                  <option value="3">3 stars</option>
                  <option value="4">4 stars</option>
                  <option value="5">5 stars</option>
                </select>
                <h3>Title:</h3>
                <input
                  type="text"
                  name="name"
                  value={this.state.name}
                  onChange={this.textChange}
                  disabled
                />
                <h3>Body:</h3>
                <textarea
                  name="text"
                  value={this.state.text}
                  onChange={this.textChange}
                  disabled
                />
                <span>{`Thumbs Up: ${review.thumbsUp}`}</span>|
                <span>{`Thumbs Down: ${review.thumbsDown}`}</span>
                <div>
                  <button type="submit">Submit</button>
                  <button onClick={handleClose}>Close</button>
                </div>
              </div>
            </form>
          );
        }}
      </Mutation>
    )}
  />
</div>;

// your own during edit, rating already

<div>
  <MicroModal
    trigger={(handleOpen) => (
      <div>
        <div>{`${review.ProjectReviewed.name}`}</div>
        <div>{`Review By: @${review.Author.username}`}</div>
        <div>{`${review.timestamp}`}</div>
        <img src={`${review.ProjectReviewed.titleImg}`} alt="project" />
        <div>{`${review.name}`}</div>
        <button onClick={handleOpen}>View More</button>
      </div>
    )}
    children={(handleClose) => (
      <Mutation mutation={editReview}>
        {(editReview, { loading, error, data }) => {
          return (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const date = await new Date(Date.now());
                await editReview({
                  variables: {
                    name: this.state.name,
                    text: this.state.text,
                    timestamp: date,
                    projId: review.ProjectReviewed.id,
                    revId: review.id
                  }
                });
                await this.setState({ ...this.state, edit: false });
              }}
            >
              <div>
                <div>{`${review.ProjectReviewed.name}`}</div>
                <div>{`Review By: @${review.Author.username}`}</div>
                <div>{`${review.timestamp}`}</div>
                <img src={`${review.ProjectReviewed.titleImg}`} alt="project" />
                <div>{`Rating of Project: ${review.projRating}`}</div>
                <h3>Title:</h3>
                <input
                  type="text"
                  name="name"
                  value={this.state.name}
                  onChange={this.textChange}
                  disabled
                />
                <h3>Body:</h3>
                <textarea
                  name="text"
                  value={this.state.text}
                  onChange={this.textChange}
                  disabled
                />
                <span>{`Thumbs Up: ${review.thumbsUp}`}</span>|
                <span>{`Thumbs Down: ${review.thumbsDown}`}</span>
                <div>
                  <button type="submit">Submit</button>
                  <button onClick={handleClose}>Close</button>
                </div>
              </div>
            </form>
          );
        }}
      </Mutation>
    )}
  />
</div>;
